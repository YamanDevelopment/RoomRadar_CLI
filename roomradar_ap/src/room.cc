#include "../include/types.hh"

using namespace roomradar;

Room::Room() {
    // Initialize member variables (its just place holder)
    std::string Roomstr = "112";
    std::string Building = "ED";
    std::string Bldg_Room_3 = "ED112";
    std::string Bldg_Room_2 = "ED11";
    std::string Bldg_Room_1 = "ED1";

}

Room::~Room() {
    // Cleanup if needed
}

std::string Room::schedule(std::string room_code) {
    // Implement schedule lookup
    return "";
}

std::string Room::room_status(std::string room_code) {
    // Implement room status lookup
    return "";
}