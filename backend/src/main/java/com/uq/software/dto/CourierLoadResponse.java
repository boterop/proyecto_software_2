package com.uq.software.dto;

public record CourierLoadResponse(
    Long id, String name, String email, long activeShipments, boolean available) {}
