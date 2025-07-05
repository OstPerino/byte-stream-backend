
utils-down:
    docker-compose -f docker-compose.utils.yaml down
utils-up:
    docker-compose -f docker-compose.utils.yaml up -d
redis-insight-up:
    docker run -d --name redisinsight -p 5540:5540 redislabs/redisinsight:latest
redis-insight-clear:
    docker container stop redisinsight && docker container rm redisinsight

db-push:
    pnpm run db:push
studio:
    pnpm run db:studio

dev:
    pnpm run start:dev
lint:
    pnpm run lint
