package com.beachresort.controllers;

import com.beachresort.models.Bill;
import com.beachresort.repositories.BillRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
@Tag(name = "Billing", description = "Billing and Invoices - Admin Only")
public class BillingController {

    private final BillRepository billRepository;

    public BillingController(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "View all bills (Admin Only)")
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Generate a new bill (Admin Only)")
    public Bill createBill(@RequestBody Bill bill) {
        return billRepository.save(bill);
    }
}
