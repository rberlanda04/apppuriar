/**
 * ============================================================
 *  config.h — Configurações da Lixeira Inteligente (Modo USB)
 * ============================================================
 */

#ifndef CONFIG_H
#define CONFIG_H

// ============================================================
// Pinagem dos Servomotores
// ============================================================
#define SERVO_ORGANICO_PIN    14
#define SERVO_RECICLAVEL_PIN  13
#define SERVO_ELETRONICO_PIN  2

// ============================================================
// LED Flash integrado do ESP32-CAM
// ============================================================
#define FLASH_LED_PIN          4

// ============================================================
// Modelo da câmera
// ============================================================
#define CAMERA_MODEL_AI_THINKER

// ============================================================
// Configurações da câmera para USB Serial
// Como a porta serial é mais lenta que Wi-Fi, usamos QVGA
// ============================================================
#define JPEG_QUALITY          12
#define FRAME_SIZE            FRAMESIZE_QVGA // 320x240 pixels

// ============================================================
// Parâmetros dos servomotores
// ============================================================
#define SERVO_OPEN_ANGLE      90
#define SERVO_CLOSE_ANGLE      0
#define SERVO_OPEN_TIME     4000   // Tempo aberto em ms

#endif // CONFIG_H
