.PHONY: setup dev build run down logs clean

setup:
	cp -n .env.example .env

dev:
	cargo run -p osrx-api & cd web && npm run dev

build:
	docker compose build

run:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

clean:
	docker compose down -v
	cargo clean
	rm -rf web/build web/node_modules
