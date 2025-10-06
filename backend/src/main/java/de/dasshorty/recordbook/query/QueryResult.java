package de.dasshorty.recordbook.query;

import java.util.List;

public record QueryResult<T>(int total, int limit, int offset, List<T> data) {
}
