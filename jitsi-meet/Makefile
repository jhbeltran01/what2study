BUILD_DIR = build
CLEANCSS = ./node_modules/.bin/cleancss
DEPLOY_DIR = libs
LIBJITSIMEET_DIR = node_modules/lib-jitsi-meet
OLM_DIR = node_modules/@matrix-org/olm
TF_WASM_DIR = node_modules/@tensorflow/tfjs-backend-wasm/dist/
RNNOISE_WASM_DIR = node_modules/@jitsi/rnnoise-wasm/dist
EXCALIDRAW_DIR = node_modules/@jitsi/excalidraw/dist/excalidraw-assets
EXCALIDRAW_DIR_DEV = node_modules/@jitsi/excalidraw/dist/excalidraw-assets-dev
TFLITE_WASM = react/features/stream-effects/virtual-background/vendor/tflite
MEET_MODELS_DIR  = react/features/stream-effects/virtual-background/vendor/models
FACE_MODELS_DIR = node_modules/@vladmandic/human-models/models
NODE_SASS = ./node_modules/.bin/sass
NPM = npm
OUTPUT_DIR = .
STYLES_BUNDLE = css/all.bundle.css
STYLES_DESTINATION = css/all.css
STYLES_MAIN = css/main.scss
ifeq ($(OS),Windows_NT)
	WEBPACK = .\node_modules\.bin\webpack
	WEBPACK_DEV_SERVER = .\node_modules\.bin\webpack serve --mode development
else
	WEBPACK = ./node_modules/.bin/webpack
	WEBPACK_DEV_SERVER = ./node_modules/.bin/webpack serve --mode development
endif

all: compile deploy

compile: 
	NODE_OPTIONS=--max-old-space-size=8192 ./node_modules/.bin/webpack

.NOTPARALLEL:
deploy: deploy-css deploy-local


deploy-css:
	$(NODE_SASS) $(STYLES_MAIN) $(STYLES_BUNDLE) && \
	$(CLEANCSS) --skip-rebase $(STYLES_BUNDLE) > $(STYLES_DESTINATION) && \
	rm $(STYLES_BUNDLE)

deploy-local:
	([ ! -x deploy-local.sh ] || ./deploy-local.sh)

.NOTPARALLEL:
dev: deploy-css
	$(WEBPACK_DEV_SERVER)

source-package: compile deploy
	mkdir -p source_package/jitsi-meet/css && \
	cp -r *.js *.html resources/*.txt fonts images libs static sounds LICENSE lang source_package/jitsi-meet && \
	cp css/all.css source_package/jitsi-meet/css && \
	(cd source_package ; tar cjf ../jitsi-meet.tar.bz2 jitsi-meet) && \
	rm -rf source_package
