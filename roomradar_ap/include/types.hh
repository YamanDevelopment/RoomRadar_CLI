#ifndef TYPES_H
#define TYPES_H

#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <nlohmann/json.hpp>
#include <iomanip>
#include <cstring>
#include <fstream>
#include <sstream>
#include <chrono>
#include <ctime>


namespace roomradar {

class Room {
        public:
                std::string RoomStr; // the room code so like in ED112 the room code is 112
                std::string Building; // the building code so like in ED112 the building code is ED
                std::string Bldg_Room_3; // the building and room code so like in ED112 the building and room code is ED112
                std::string Bldg_Room_2; // the building and room code so like in ED112 this string would be ED11
                std::string Bldg_Room_1; // the building and room code so like in ED112 this string would be ED1

                Room();
                ~Room();

                // Basic schedule lookup
                 std::string schedule(std::string room_code);
        
                 // Day-specific schedule lookup
                std::string schedule(std::string room_code, std::string weekday);
        
                // For current room status: room_status("ED112")
                std::string room_status(std::string room_code);

                void show_help();
                void show_more_help();
};

typedef enum {
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY,
        SUNDAY
} Day;

}

#endif // TYPES_H