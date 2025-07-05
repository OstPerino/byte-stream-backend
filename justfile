
utils-down:
    docker-compose -f docker-compose.utils.yaml down
utils-up:
    docker-compose -f docker-compose.utils.yaml up -d

db-push:
    pnpm run db:push
studio:
    pnpm run db:studio

dev:
    pnpm run start:dev
