package com.backend.Repository;

import com.backend.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

	Payment findByUserId(Long userId);

}
