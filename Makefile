.PHONY: setup fmt lint test build check

setup:
	npm install

fmt:
	npm run format

lint:
	npm run lint

test:
	npm run test

build:
	npm run build

check:
	npm run check

