package dev.datile.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/* Standardized error handling */

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorDto> handleIllegalArgument(IllegalArgumentException ex) {
        log.debug("Bad request: {}", ex.getMessage());

        var body = new ApiErrorDto(
                "Bad request",
                ex.getMessage() != null ? ex.getMessage() : "Invalid request"
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorDto> handleUnexpected(Exception ex) {
        log.error("Unexpected server error", ex);

        var body = new ApiErrorDto(
                "Internal server error",
                "Something went wrong on the server"
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}