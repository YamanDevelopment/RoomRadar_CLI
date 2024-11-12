#include "../include/types.hh"

using namespace roomradar;
using json = nlohmann::json;


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

// function overloading be like

std::string Room::schedule(std::string room_code) {
    try {
        std::ifstream f("room_data.json");
        nlohmann::json data = nlohmann::json::parse(f);
        f.close();

        std::stringstream output;
        bool found = false;

        // Iterate through all rooms to find matches
        for (const auto& [key, value] : data.items()) {
            if (key.find(room_code) == 0) { // Check if key starts with room_code
                found = true;
                nlohmann::json schedule = value["schedule"];
                output << "\nSchedule for " << key << ":\n";

                // Get current day
                auto now = std::chrono::system_clock::now();
                std::time_t now_c = std::chrono::system_clock::to_time_t(now);
                std::tm local_time = *std::localtime(&now_c);
                
                std::string days_of_week[] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
                std::string today = days_of_week[local_time.tm_wday];

                // Check if today exists in schedule
                if (schedule.contains(today)) {
                    output << today << ":\n";
                    for (const auto& time : schedule[today]) {
                        output << "  " << time["start"] << " - " << time["end"] << "\n";
                    }
                } else {
                    output << "No classes scheduled for today (" << today << ").\n";
                }
            }
        }

        if (!found) {
            return "No rooms found matching " + room_code;
        }

        return output.str();
    }
    catch (const nlohmann::json::exception& e) {
        return "Error reading schedule: " + std::string(e.what());
    }
}


std::string Room::schedule(std::string room_code, std::string weekday) {
    try {
        std::ifstream f("room_data.json");
        nlohmann::json data = nlohmann::json::parse(f);
        f.close();

        std::stringstream output;
        bool found = false;

        // Iterate through all rooms to find matches
        for (const auto& [key, value] : data.items()) {
            if (key.find(room_code) == 0) { // Check if key starts with room_code
                found = true;
                nlohmann::json schedule = value["schedule"];
                output << "\nSchedule for " << key << " on " << weekday << ":\n";

                if (schedule.contains(weekday)) {
                    for (const auto& time : schedule[weekday]) {
                        output << "  " << time["start"] << " - " << time["end"] << "\n";
                    }
                } else {
                    output << "No classes scheduled for " << weekday << "\n";
                }
            }
        }

        if (!found) {
            return "No rooms found matching " + room_code;
        }

        return output.str();
    }
    catch (const nlohmann::json::exception& e) {
        return "Error reading schedule: " + std::string(e.what());
    }
}

std::string Room::room_status(std::string room_code) {
    try {
        std::ifstream f("room_data.json");
        nlohmann::json data = nlohmann::json::parse(f);
        f.close();

        nlohmann::json room = data[room_code];
        if (room.is_null()) {
            return "Room not found.";
        }

        // Get current time and day
        auto now = std::chrono::system_clock::now();
        std::time_t now_c = std::chrono::system_clock::to_time_t(now);
        std::tm local_time = *std::localtime(&now_c);
        
        std::string days_of_week[] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
        std::string today = days_of_week[local_time.tm_wday];

        // Format current time as HH:MM
        std::stringstream current_time;
        current_time << std::setfill('0') << std::setw(2) << local_time.tm_hour << ":"
                    << std::setfill('0') << std::setw(2) << local_time.tm_min;

        std::stringstream output;
        output << "Status for " << room_code << ":\n";
        output << "Building: " << room["Building"] << "\n";
        output << "Type: " << room["RoomType"] << "\n";
        output << "Capacity: " << room["StudentCapacity"] << "\n";
        output << "Features:\n";
        output << "  - Zoom Enabled: " << (room["ZoomEnabled"] ? "Yes" : "No") << "\n";
        output << "  - Video Conference: " << (room["VideoConf"] ? "Yes" : "No") << "\n";
        output << "  - Mediasite: " << (room["Mediasite"] ? "Yes" : "No") << "\n";

        // Check current availability
        bool is_available = true;
        std::string next_class = "No more classes today";
        
        if (room["schedule"].contains(today)) {
            for (const auto& time : room["schedule"][today]) {
                std::string start = time["start"];
                std::string end = time["end"];
                
                if (current_time.str() >= start && current_time.str() <= end) {
                    is_available = false;
                    output << "\nCurrently: In Use (Class until " << end << ")\n";
                    break;
                } else if (current_time.str() < start) {
                    next_class = "Next class at " + start;
                    break;
                }
            }
        }
        
        if (is_available) {
            output << "\nCurrently: Available\n";
            output << next_class << "\n";
        }

        return output.str();
    }
    catch (const nlohmann::json::exception& e) {
        return "Error reading room status: " + std::string(e.what());
    }
}

