# http://stackoverflow.com/questions/307503/whats-a-concise-way-to-check-that-environment-variables-are-set-in-unix-shellsc
: "${SWAGGER_TARGET:?SWAGGER_TARGET environment variable must be set.}"
: "${BACKUP_SWAGGER_TARGET:?BACKUP_SWAGGER_TARGET environment variable must be set.}"

for TARGET in $SWAGGER_TARGET $BACKUP_SWAGGER_TARGET; do
echo "Deploying to $TARGET"
aws s3 cp ./dist/ $TARGET --recursive --exclude='index.html' --cache-control='max-age=3153600' --acl public-read && \
aws s3 cp ./dist/index.html $TARGET --cache-control='must-revalidate,max-age=0' --acl public-read
done
