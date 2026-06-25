#include "config.h"
#include "esp_camera.h"
#include <ESP32Servo.h>
#include "mbedtls/base64.h"

// Pinos da câmera AI_THINKER
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

Servo servoOrganico;
Servo servoReciclavel;
Servo servoEletronico;

bool cameraIniciada = false;
unsigned long lastCaptureTime = 0;
const int CAPTURE_INTERVAL = 1000; // Captura e envia a cada 1 segundo

// ----------------------------------------------------------------------------
// Configuração da Câmera
// ----------------------------------------------------------------------------
void setupCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  
  if(psramFound()){
    config.frame_size = FRAME_SIZE; 
    config.jpeg_quality = JPEG_QUALITY;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }
  
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("LOG: Erro ao iniciar a camera: 0x%x\n", err);
    return;
  }
  
  sensor_t *s = esp_camera_sensor_get();
  s->set_vflip(s, 1);
  s->set_hmirror(s, 1);
  
  cameraIniciada = true;
  Serial.println("LOG: Camera iniciada com sucesso.");
}

// ----------------------------------------------------------------------------
// Setup Principal
// ----------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\nLOG: Iniciando Lixeira Inteligente (Modo Serial USB)");

  pinMode(FLASH_LED_PIN, OUTPUT);
  digitalWrite(FLASH_LED_PIN, LOW);

  // Como não estão usando servos por enquanto, comentamos para evitar conflito de LEDC com a câmera
  /*
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  
  servoOrganico.setPeriodHertz(50);
  servoReciclavel.setPeriodHertz(50);
  servoEletronico.setPeriodHertz(50);
  
  servoOrganico.attach(SERVO_ORGANICO_PIN, 500, 2400);
  servoReciclavel.attach(SERVO_RECICLAVEL_PIN, 500, 2400);
  servoEletronico.attach(SERVO_ELETRONICO_PIN, 500, 2400);

  servoOrganico.write(SERVO_CLOSE_ANGLE);
  servoReciclavel.write(SERVO_CLOSE_ANGLE);
  servoEletronico.write(SERVO_CLOSE_ANGLE);
  */

  setupCamera();
  Serial.println("READY");
}

// ----------------------------------------------------------------------------
// Loop Principal
// ----------------------------------------------------------------------------
void loop() {
  // Checar comandos da porta Serial
  if (Serial.available()) {
    String comando = Serial.readStringUntil('\n');
    comando.trim();
    if (comando.startsWith("SERVO:")) {
      String tipo = comando.substring(6);
      
      // Piscar LED
      digitalWrite(FLASH_LED_PIN, HIGH);
      delay(50);
      digitalWrite(FLASH_LED_PIN, LOW);
      
      Servo *alvo = nullptr;
      if (tipo == "organico") alvo = &servoOrganico;
      else if (tipo == "reciclavel") alvo = &servoReciclavel;
      else if (tipo == "eletronico") alvo = &servoEletronico;
      
      // Apenas simulamos o comando recebido para não crashar o firmware sem servos anexados
      Serial.println("LOG: Comando de servo simulado recebido: " + tipo);
      /*
      if (alvo != nullptr) {
        alvo->write(SERVO_OPEN_ANGLE);
        Serial.println("LOG: Servo aberto: " + tipo);
        delay(SERVO_OPEN_TIME);
        alvo->write(SERVO_CLOSE_ANGLE);
        Serial.println("LOG: Servo fechado.");
      } else {
        Serial.println("LOG: Comando de servo invalido.");
      }
      */
    }
  }

  // Capturar e enviar foto periodicamente
  if (cameraIniciada && (millis() - lastCaptureTime > CAPTURE_INTERVAL)) {
    lastCaptureTime = millis();
    
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("LOG: Falha na captura do frame");
      return;
    }
    
    // Converter para Base64 usando mbedtls
    size_t out_len = 0;
    mbedtls_base64_encode(NULL, 0, &out_len, fb->buf, fb->len);
    
    unsigned char * base64_buf = (unsigned char *)malloc(out_len + 1);
    if (base64_buf != NULL) {
      mbedtls_base64_encode(base64_buf, out_len, &out_len, fb->buf, fb->len);
      base64_buf[out_len] = '\0';
      
      // Enviar marcadores e o frame Base64 pela porta serial
      Serial.print("FRAME:");
      Serial.println((char *)base64_buf);
      
      free(base64_buf);
    } else {
      Serial.println("LOG: Erro de alocacao de memoria para base64");
    }
    
    esp_camera_fb_return(fb);
  }
}
