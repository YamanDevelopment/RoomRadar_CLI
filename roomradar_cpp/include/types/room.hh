#ifndef ROOM_HH
#define ROOM_HH
#include<iostream>
#include<string>
class roomData {
    std::string room_number;
    std::string schedule;
    std::string status;
    int rating;
    friend std::ostream& operator<<(std::ostream &o, const roomData data);
};
#endif