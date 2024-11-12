#include "../include/types.hh"

using namespace roomradar;

void Room::show_help() {
    std::cout << "Welcome to RoomRadar!\n";
    std::cout << "Usage:\n";
    std::cout << "    roomradar help                - Get help\n";
    std::cout << "    roomradar schedule ROOM       - Get room schedule\n";
    std::cout << "    roomradar status ROOM         - Get room status and features\n";
    std::cout << "    roomradar schedule day DAY ROOM - Get schedule for specific day\n";
}

void Room::show_more_help() {
        std::cout << "RoomRadar CLI Help:\n";
        std::cout << "    Pass in your search query as an argument to find a room or building.\n";
        std::cout << "    Example:\n";
        std::cout << "        roomradar schedule ED112\n";
        std::cout << "    Your search query can contain a partial room number.\n";
        std::cout << "    Example:\n";
        std::cout << "        roomradar schedule ED11\n or\n       roomradar schedule 112\n";
        std::cout << "    Use the schedule flag to get the specific day schedule of a room.\n";
        std::cout << "    Example:\n";
        std::cout << "        roomradar schedule day Monday ED112\n";
        std::cout << "    Use the status flag to get the status of a room.\n";
        std::cout << "    Example:\n";
        std::cout << "        roomradar status ED112\n";


}