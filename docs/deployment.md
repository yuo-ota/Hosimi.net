# デプロイ（CI / CD）

## 全体像

```
master へ push / PR マージ
  ├─ CI  (.github/workflows/ci.yml)     … backend の scan / lint / test、frontend の build
  └─ CD  (.github/workflows/deploy.yml) … イメージを GHCR に push → 本番サーバーで pull して再起動
```

- CD のトリガー: `master` への push、および手動実行（Actions 画面の "Run workflow"）
- イメージ: `ghcr.io/yuo-ota/hosimi-backend` / `ghcr.io/yuo-ota/hosimi-frontend`
  - タグは `latest` と push 時の commit SHA の2つ
- 本番サーバーは `docker compose pull` するだけ。ビルドはしない

## 必要な設定（GitHub リポジトリ）

`deploy` ジョブは Environment **`production`** を使う（`deploy.yml` の `environment: production`）。
以下は Settings → Environments → `production` に登録する。

### Environment secrets

| 名前 | 内容 |
|---|---|
| `SSH_PRIVATE_KEY` | CD 専用 SSH 秘密鍵（公開鍵はサーバーの `~/.ssh/authorized_keys` に登録済みであること） |
| `GHCR_PAT` | GHCR の private イメージを pull するための PAT。スコープ `read:packages` |

### Environment variables

| 名前 | 例 | 内容 |
|---|---|---|
| `SSH_HOST` | `hosimi.net` | 本番サーバーの IP / ホスト名 |
| `SSH_USER` | `github-cd` | SSH ユーザー名 |
| `SSH_PORT` | `2222` | SSH ポート（22 なら未設定でよい） |
| `DEPLOY_PATH` | `/opt/hosimi` | サーバー上でリポジトリを配置しているパス（`docker-compose.yml` と `.env` がある場所） |

`GITHUB_TOKEN` は自動で用意されるため登録不要（`build-and-push` のイメージ push に使用）。

### リポジトリ Variables（任意・`build-and-push` 用）

| 名前 | 値 | 備考 |
|---|---|---|
| `NEXT_PUBLIC_API_ORIGIN` | （空） | 空 = リバースプロキシ経由の相対パス `/api` を使う |
| `NEXT_PUBLIC_ADOBE_FONTS_KIT_ID` | `juv0bpv` | 未設定でも Dockerfile / ワークフロー側の既定値が入る |

## 本番サーバー側の前提

- `DEPLOY_PATH` に本リポジトリが clone 済みで `git fetch` / `git checkout` ができる
- 同じディレクトリに `.env`（`.env.sample` 参照）がある
- Docker / Docker Compose v2 が動作し、既存スタックが `docker compose up -d` で起動している
- TLS 終端（443 → `127.0.0.1:8000`）は compose の外側で構成されている。CD は触らない
- **サーバー上で git 管理対象ファイルを手編集しないこと**。CD が `git reset --hard` するため失われる（`.env` は git 管理外なので安全）

## CD がサーバー上で実行する内容

1. `git fetch` → `master` に合わせて `git reset --hard`（compose / nginx 設定を更新）
2. `.env` の `IMAGE_TAG` を今回の commit SHA に書き換え
3. `docker login ghcr.io`（`GHCR_PAT`）
4. `docker compose pull rails nextjs`
5. `docker compose up -d`（変更のあったコンテナのみ再作成）
6. `nginx -t` → `nginx -s reload`（`./nginx` はバインドマウントで、`up -d` では設定が再読み込みされないため）
7. `docker image prune -f`
8. ヘルスチェック: `http://127.0.0.1:8000/` と `/api/constellations` に `curl`

DB マイグレーション / seed は Rails コンテナの起動時に自動実行される（`bin/docker-entrypoint` / compose の `command`）。

## ロールバック

戻したい commit SHA を控えて、サーバーで:

```bash
cd <DEPLOY_PATH>
sed -i 's|^IMAGE_TAG=.*|IMAGE_TAG=<戻したいSHA>|' .env
docker compose pull rails nextjs
docker compose up -d
```

`latest` は常に最新ビルドを指すので、ロールバック時は必ず SHA を指定する。
過去の SHA タグのイメージが `docker image prune` で消えている場合は、そのコミットで
CD を再実行（手動トリガー）するのが確実。

## ローカルでのイメージ確認

```bash
cd frontend && npm run build   # 従来どおり事前ビルドは不要になったが任意
docker compose build
docker compose up -d
```

`docker-compose.yml` は `build:` と `image:` を併記している。ローカルは `build`、
本番は `pull` で同じ `image:` 名を使う。
