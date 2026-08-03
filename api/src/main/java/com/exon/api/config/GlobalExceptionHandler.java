package com.exon.api.config;

import com.exon.api.model.ErrorDetail;
import com.exon.api.model.RunResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/**
 * Translates Spring validation failures into the standard RunResponse format
 * so the frontend always receives a consistent error structure.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RunResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<ErrorDetail> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> new ErrorDetail(0, fe.getDefaultMessage(), "RUNTIME"))
                .toList();
        return ResponseEntity.badRequest().body(RunResponse.failure("", errors, 0));
    }
}
