package com.uq.software.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserProfileRequest(
        @Pattern(regexp = "^[0-9+ ()-]{7,20}$", message = "Phone is invalid") String phone,
        @Size(max = 200, message = "Address is too long") String address,
        @Size(max = 100, message = "City is too long") String city) {
}