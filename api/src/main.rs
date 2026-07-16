use axum::{
    body::Body,
    extract::{DefaultBodyLimit, Multipart},
    http::{header, StatusCode},
    response::{IntoResponse, Json, Response},
    routing::{get, post},
    Router,
};
use base64::{engine::general_purpose, Engine};
use chrono::{DateTime, Utc};
use osr_rs::Replay;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct ReplayDto {
    play_mode:   i8,
    osu_version: i32,
    beatmap_md5: String,
    username:    String,
    replay_md5:  String,
    count_300:   u16,
    count_100:   u16,
    count_50:    u16,
    count_geki:  u16,
    count_katu:  u16,
    count_miss:  u16,
    score:       i32,
    max_combo:   u16,
    fullcombo:   bool,
    mods:        u32,
    timestamp:   String, // RFC 3339
    online_id:   i64,
    raw_b64:     String,
    #[serde(skip_serializing_if = "Option::is_none")]
    score_info:  Option<serde_json::Value>,
}

fn replay_to_dto(replay: &Replay, raw_bytes: &[u8]) -> ReplayDto {
    ReplayDto {
        play_mode:   replay.play_mode,
        osu_version: replay.osu_version,
        beatmap_md5: replay.beatmap_md5.clone(),
        username:    replay.username.clone(),
        replay_md5:  replay.replay_md5.clone(),
        count_300:   replay.count_300,
        count_100:   replay.count_100,
        count_50:    replay.count_50,
        count_geki:  replay.count_geki,
        count_katu:  replay.count_katu,
        count_miss:  replay.count_miss,
        score:       replay.score,
        max_combo:   replay.max_combo,
        fullcombo:   replay.fullcombo,
        mods:        replay.mods,
        timestamp:   replay.timestamp.to_rfc3339(),
        online_id:   replay.online_id,
        raw_b64:     general_purpose::STANDARD.encode(raw_bytes),
        score_info:  replay.score_info.as_ref().map(|si| serde_json::to_value(si).unwrap()),
    }
}

async fn health() -> &'static str {
    "ok"
}

async fn parse_handler(mut multipart: Multipart) -> Response {
    let mut file_bytes: Option<Vec<u8>> = None;

    while let Ok(Some(field)) = multipart.next_field().await {
        if field.name() == Some("file") {
            match field.bytes().await {
                Ok(b) => file_bytes = Some(b.to_vec()),
                Err(_) => {
                    return (StatusCode::BAD_REQUEST, "failed to read file field").into_response()
                }
            }
        }
    }

    let bytes = match file_bytes {
        Some(b) => b,
        None => return (StatusCode::BAD_REQUEST, "no 'file' field in multipart").into_response(),
    };

    match Replay::from_bytes(&bytes) {
        Ok(replay) => Json(replay_to_dto(&replay, &bytes)).into_response(),
        Err(e) => (
            StatusCode::UNPROCESSABLE_ENTITY,
            format!("parse error: {e}"),
        )
            .into_response(),
    }
}

async fn write_handler(Json(dto): Json<ReplayDto>) -> Response {
    let raw_bytes = match general_purpose::STANDARD.decode(&dto.raw_b64) {
        Ok(b) => b,
        Err(_) => {
            return (StatusCode::BAD_REQUEST, "invalid raw_b64").into_response()
        }
    };

    let original = match Replay::from_bytes(&raw_bytes) {
        Ok(r) => r,
        Err(e) => {
            return (
                StatusCode::UNPROCESSABLE_ENTITY,
                format!("could not re-parse original: {e}"),
            )
                .into_response()
        }
    };

    let ts: DateTime<Utc> = dto
        .timestamp
        .parse()
        .unwrap_or_else(|_| original.timestamp);

    let mut updated = original
        .play_mode(dto.play_mode)
        .osu_version(dto.osu_version)
        .beatmap_md5(dto.beatmap_md5.clone())
        .username(dto.username.clone())
        .replay_md5(dto.replay_md5.clone())
        .n300(dto.count_300)
        .n100(dto.count_100)
        .n50(dto.count_50)
        .ngeki(dto.count_geki)
        .nkatu(dto.count_katu)
        .nmiss(dto.count_miss)
        .score(dto.score)
        .max_combo(dto.max_combo)
        .full_combo(dto.fullcombo)
        .mods(dto.mods)
        .timestamp(ts)
        .online_id(dto.online_id);

    if let Some(si) = dto.score_info {
        if let Ok(score_info) = serde_json::from_value(si) {
            updated.score_info = Some(score_info);
        }
    }

    match updated.write_bytes() {
        Ok(out) => {
            let filename = format!("{}.osr", dto.username.replace(' ', "_"));
            Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, "application/octet-stream")
                .header(
                    header::CONTENT_DISPOSITION,
                    format!(r#"attachment; filename="{filename}""#),
                )
                .body(Body::from(out))
                .unwrap()
        }
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("write error: {e}"),
        )
            .into_response(),
    }
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health))
        .route("/api/parse", post(parse_handler))
        .route("/api/write", post(write_handler))
        .layer(DefaultBodyLimit::max(5 * 1024 * 1024));

    let port = std::env::var("API_PORT").unwrap_or_else(|_| "3001".into());
    let addr = format!("0.0.0.0:{port}");
    println!("osrx-api  →  http://{addr}");

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();

    axum::serve(listener, app)
        .with_graceful_shutdown(async {
            tokio::signal::ctrl_c().await.ok();
            eprintln!("\ngraceful shutdown");
        })
        .await
        .unwrap();
}
