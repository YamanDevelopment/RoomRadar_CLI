#include "../include/types.hh"

using namespace roomradar;

int main(int argc, char* argv[]) {
    Room room;
    if (argc < 2) {
        room.show_help();
        return 1;
    }

    if (strcmp(argv[1], "schedule") == 0) {
        if (argc < 3) {
            std::cout << "Error: Room number not equipped with schedule flag." << std::endl;
            return 1;
        }
        
        // Check for optional day parameter
        if (argc >= 5 && strcmp(argv[2], "day") == 0) {
            // Format: schedule day WEEKDAY ROOM
            room.schedule(argv[4], argv[3]); // Pass both room and day
        } else {
            // Format: schedule ROOM
            room.schedule(argv[2]); // Original behavior
        }
    }
    else if (strcmp(argv[1], "help") == 0) {
        room.show_more_help();
    }
    else {
        room.room_status(argv[1]);
    }
    return 0;
}