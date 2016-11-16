# http://stackoverflow.com/questions/307503/whats-a-concise-way-to-check-that-environment-variables-are-set-in-unix-shellsc
: "${SWAGGER_TARGET:?SWAGGER_TARGET environment variable must be set.}"

echo "Deploying to $SWAGGER_TARGET"
aws s3 cp ./dist/ $SWAGGER_TARGET --recursive --exclude='index.html' --cache-control='max-age=3153600' --acl public-read && \
aws s3 cp ./dist/index.html $SWAGGER_TARGET --cache-control='must-revalidate,max-age=0' --acl public-read