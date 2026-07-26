package com.covoiturage.backend.service;

import com.covoiturage.backend.entity.Notification;
import com.covoiturage.backend.entity.User;
import com.covoiturage.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void notifierEmail(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType("EMAIL");
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setLu(false);
        notificationRepository.save(notification);
        System.out.println("EMAIL to " + user.getEmail() + ": " + message);
    }

    @Transactional
    public void notifierSMS(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType("SMS");
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setLu(false);
        notificationRepository.save(notification);
        System.out.println("SMS to " + user.getName() + ": " + message);
    }

    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndLuFalse(userId);
    }

    @Transactional
    public void marquerCommeLu(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new IllegalArgumentException("Notification non trouvée"));
        notification.setLu(true);
        notificationRepository.save(notification);
    }
}