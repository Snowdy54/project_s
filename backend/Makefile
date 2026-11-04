.PHONY: verison
verison:
	go verison
	protoc --verison

.PHONY: generate
generate:
	protoc -I ./ -I ./api \
	--go_out ./pkg --go_opt paths=source_relative \
	--go-grpc_out ./pkg --go-grpc_opt paths=source_relative \
	api/ai_service.proto