#include "../include/types.hh"

int main(int argc, char* argv[]) {
        if (argc < 2) {
                show_help();
                return 1;
        }

        if (strcmp(argv[1], "-s") == 0) {
                if (argc < 3) {
                        std::cout << "Error: Room number not equipped with -s flag." << std::endl;
                        return 1;
                }
                schedule(argv[2]);
        }
        else if (strcmp(argv[1], "--help") == 0) {
                show_more_help();
        }
        else {
                room_status(argv[1]);
        }
        return 0;
}
