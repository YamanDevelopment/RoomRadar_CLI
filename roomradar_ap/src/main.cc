#include "../include/types.hh"

using namespace roomradar;

int main(int argc, char* argv[]) {
        Room room;
        if (argc < 2) {
            room.show_help();
            return 1;
        }

        std::string result; // Store function return values

        if (strcmp(argv[1], "schedule") == 0) {
            if (argc < 3) {
                std::cout << "Error: Room number required." << std::endl;
                return 1;
            }
        
            if (argc >= 5 && strcmp(argv[2], "day") == 0) {
                // Format: schedule day WEEKDAY ROOM
                std::string room_code(argv[4]);
                std::string weekday(argv[3]);
                result = room.schedule(room_code, weekday);
        } else {
            // Format: schedule ROOM
            std::string room_code(argv[2]);
            result = room.schedule(room_code);
        }
        std::cout << result; // Print schedule result
        }
        else if (strcmp(argv[1], "help") == 0) {
            room.show_more_help();
        }
        else {
            std::string room_code(argv[1]);
            result = room.room_status(room_code);
            std::cout << result;
        }
        return 0;
}