all: install
install: config
	npm install
	npm run createui
	npm run minifyui
config:
  npm run config
test: install
	npm run test
docs: install
	npm run docs
