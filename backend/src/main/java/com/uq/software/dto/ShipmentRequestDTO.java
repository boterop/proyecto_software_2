package com.uq.software.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ShipmentRequestDTO(
    @NotNull(message = "Sender ID is required") Long senderId,
    @NotBlank(message = "Origin address is required")
        @Size(max = 200, message = "Origin address must be at most 200 characters")
        String originAddress,
    @NotBlank(message = "Destination address is required")
        @Size(max = 200, message = "Destination address must be at most 200 characters")
        String destinationAddress,
    @NotBlank(message = "Receiver name is required")
        @Size(max = 100, message = "Receiver name must be at most 100 characters")
        String receiverName,
    @NotBlank(message = "Receiver phone is required")
        @Pattern(regexp = "^[0-9+\\- ]{7,15}$", message = "Invalid phone number")
        String receiverPhone,
    @Email(message = "Invalid email") String receiverEmail,
    @NotBlank(message = "Package description is required")
        @Size(max = 500, message = "Description must be at most 500 characters")
        String packageDescription,
    @NotNull(message = "Length is required")
        @Positive(message = "Length must be greater than 0")
        @DecimalMax(value = "200.0", message = "Length must be at most 200 cm")
        Double lengthCm,
    @NotNull(message = "Width is required")
        @Positive(message = "Width must be greater than 0")
        @DecimalMax(value = "200.0", message = "Width must be at most 200 cm")
        Double widthCm,
    @NotNull(message = "Height is required")
        @Positive(message = "Height must be greater than 0")
        @DecimalMax(value = "200.0", message = "Height must be at most 200 cm")
        Double heightCm,
    @Positive(message = "Weight must be greater than 0")
        @DecimalMax(value = "50.0", message = "Weight must be at most 50 kg")
        Double weightKg) {}
