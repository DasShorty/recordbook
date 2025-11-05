package de.dasshorty.recordbook.http.result;

public record OptionResult<T>(T data, int offset) {
}
