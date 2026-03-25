package dev.datile.exception;

import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/* Standardized error handling */

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDto> handleValidationErrors(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Ogiltig inmatning");

        log.debug("Validation failed: {}", message);

        var body = new ApiErrorDto(
                "Validation error",
                message
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorDto> handleConstraintViolation(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations()
                .stream()
                .findFirst()
                .map(violation -> violation.getMessage())
                .orElse("Ogiltig inmatning");

        log.debug("Constraint violation: {}", message);

        var body = new ApiErrorDto(
                "Validation error",
                message
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorDto> handleIllegalArgument(IllegalArgumentException ex) {
        log.debug("Bad request: {}", ex.getMessage());

        var body = new ApiErrorDto(
                "Bad request",
                ex.getMessage() != null ? ex.getMessage() : "Invalid request"
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorDto> handleResponseStatus(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());

        log.debug("Response status exception: {} {}", status.value(), ex.getReason());

        var body = new ApiErrorDto(
                status.getReasonPhrase(),
                ex.getReason() != null ? ex.getReason() : "Request failed"
        );

        return ResponseEntity.status(status).body(body);
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