package com.example.userauth.controller;

import com.example.userauth.dto.response.ChatRoomDTO;
import com.example.userauth.dto.response.ChatRoomListResponseDTO;
import com.example.userauth.dto.response.ChatRoomListWrapperResponseDTO;
import com.example.userauth.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/chats/rooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @GetMapping
    public ResponseEntity<ChatRoomListWrapperResponseDTO> getChatRooms(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(required = false) String search
    ) {
        try {
            ChatRoomListResponseDTO listResponse = chatRoomService.getChatRooms(page, limit, status, search);
            ChatRoomListWrapperResponseDTO wrapperResponse = new ChatRoomListWrapperResponseDTO(true, listResponse);
            return ResponseEntity.ok(wrapperResponse);
        } catch (InterruptedException | ExecutionException e) {
            // 예외 처리
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/{roomId}")
    public ResponseEntity<Map<String, Object>> getChatRoomDetail(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "50") int messageLimit) throws ExecutionException, InterruptedException {

        ChatRoomDTO chatRoomDTO = chatRoomService.getChatRoomDetail(roomId, messageLimit);
        if (chatRoomDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Chat room not found"));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", chatRoomDTO
        ));
    }
}
