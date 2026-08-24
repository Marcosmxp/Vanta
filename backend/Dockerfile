FROM golang:1.27-alpine AS build
WORKDIR /src

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/vanta-api ./cmd/api

FROM alpine:3.22
RUN apk add --no-cache ca-certificates \
    && addgroup -S vanta \
    && adduser -S -G vanta -H -s /sbin/nologin vanta

WORKDIR /app
COPY --from=build /out/vanta-api /app/vanta-api

USER vanta:vanta
EXPOSE 8080
ENTRYPOINT ["/app/vanta-api"]
