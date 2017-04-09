
#include <SoftPWM.h>


#define PING_PIN     D0
#define VIB_PIN1     D7
#define BUTTONA_PIN  D1
#define BUTTONB_PIN  D2
#define BUTTONC_PIN  D3

#define AUDIO_PIN    D4


int pingInterval = 50;
int distance = 20;

int lastPingTime = 0;
int lastBuzzToggleTime = 0;
int toggleState = 0;

int aLastPress = 0;
int bLastPress = 0;
int cLastPress = 0;

int buttonAState = 0;
int buttonBState = 0;
int buttonCState = 0;

TCPClient client;
byte server[] = { 192, 168, 0, 48 };

unsigned long measurePulse() {
    pinMode(PING_PIN, OUTPUT);
    digitalWrite(PING_PIN, LOW);
    delayMicroseconds(5);

    digitalWrite(PING_PIN, HIGH);
    delayMicroseconds(5);
    digitalWrite(PING_PIN, LOW);

    pinMode(PING_PIN, INPUT);

    unsigned long pulseDuration = pulseIn(PING_PIN, HIGH);
    return pulseDuration;
}

int toDistance(unsigned long distance){
    return distance * 17 / 1000;
}

void setup() {
    pinMode(VIB_PIN1, OUTPUT);
    pinMode(BUTTONA_PIN, INPUT_PULLUP);
    pinMode(BUTTONB_PIN, INPUT_PULLUP);
    pinMode(BUTTONC_PIN, INPUT_PULLUP);
    Serial.begin(115200);
    SoftPWMBegin();
    SoftPWMSet(AUDIO_PIN, 0);
    SoftPWMSetFadeTime(AUDIO_PIN, 0, 0);

    if (client.connect(server, 3333)) {
        Serial.println("TCP connection success");

    } else {
        Serial.println("Connection to TCP server failed");
    }

}



void loop() {
    int aPrev = buttonAState;
    int bPrev = buttonBState;
    int cPrev = buttonCState;

    buttonAState = !digitalRead(BUTTONA_PIN);
    buttonBState = !digitalRead(BUTTONB_PIN);
    buttonCState = !digitalRead(BUTTONC_PIN);



  if(millis() - lastPingTime > pingInterval) {
    Serial.print("Ping: ");
    distance = toDistance(measurePulse());
    lastPingTime = millis();
    Serial.print(distance);
    Serial.print("\t");
    Serial.print("A: ");
    Serial.print(buttonAState);
    Serial.print("\t");
    Serial.print("B: ");
    Serial.print(buttonBState);
    Serial.print("\t");
    Serial.print("C: ");
    Serial.println(buttonCState);

    client.write((byte)0x00);
    client.write((uint8_t*)&distance, 4);
    if(buttonAState) {
        if(millis() - aLastPress > 250) {
            client.write((byte)0x01);
            buttonAState = 0;
            aLastPress = millis();
        }
    }
    if(buttonBState) {
        if(millis() - bLastPress > 250) {
            client.write((byte)0x02);
            buttonBState = 0;
            bLastPress = millis();
        }
    }
    if(buttonCState) {
        if(millis() - cLastPress > 250) {
            client.write((byte)0x03);
            buttonCState = 0;
            cLastPress = millis();
        }
    }


  }

  if(millis() - lastBuzzToggleTime > distance * 2) {
      if(toggleState == 0) {
          digitalWrite(VIB_PIN1, HIGH);
          SoftPWMSet(AUDIO_PIN, 0);
          toggleState = 1;
      }
      else {
          digitalWrite(VIB_PIN1, LOW);
          SoftPWMSet(AUDIO_PIN, 60);
          toggleState = 0;
      }
      lastBuzzToggleTime = millis();
  }


}
