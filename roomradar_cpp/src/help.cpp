#include "main.hh";

void show_help() {
    std::cout << "Welcome to RoomRadar!\n";
    std::cout << "Usage:\n";
    std::cout << "    roomradar help                         - Get an overview of the possible queries.\n";
    std::cout << "    roomradar \"Your Search Query\"          - Pass in your query to find the room or building.\n";
}

void show_more_help() {
        std::cout << "RoomRadar CLI Help:\n";
        std::cout << "    Pass in your search query as an argument to find a room or building.\n";
        std::cout << "    Example:\n";
        std::cout << "        roomradar ED112\n";
        std::cout << "    Your search query can contain a partial room number.\n";
        std::cout << "    Example:\n";
        std::cout << "        roomradar ED11\n or\n       roomradar 112\n";
        std::cout << "    Use the -s flag to get the schedule of a room.\n";
        std::cout << "    Example:\n";
        std::cout << "        roomradar -s ED112\n";

}
