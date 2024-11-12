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

        nlohmann::json room = data[room_code];
        std::stringstream output;

        if (room.is_null()) {
            return "Room not found.";
        }

        nlohmann::json schedule = room["schedule"];
        output << "Schedule for " << room_code << ":\n";

        // Get the current day of the week as a string
        auto now = std::chrono::system_clock::now();
        std::time_t now_c = std::chrono::system_clock::to_time_t(now);
        std::tm local_time = *std::localtime(&now_c);
        
        std::string days_of_week[] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
        std::string today = days_of_week[local_time.tm_wday];

        // Check if today exists in the schedule
        if (schedule.contains(today)) {
            output << today << ":\n";
            for (const auto& time : schedule[today]) {
                output << "  " << time["start"] << " - " << time["end"] << "\n";
            }
        } else {
            output << "No classes scheduled for today (" << today << ").\n";
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

        nlohmann::json room = data[room_code];
        std::stringstream output;

        if (room.is_null()) {
                return "Room not found.";
        }

        nlohmann::json schedule = room["schedule"];
        
        if (!schedule.contains(weekday)) {
                return "No schedule found for " + weekday;
        }

        output << "Schedule for " << room_code << " on " << weekday << ":\n";
                for (const auto& time : schedule[weekday]) {
                output << "  " << time["start"] << " - " << time["end"] << "\n";
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

        std::stringstream output;
        output << "Current status for " << room_code << ":\n";
        output << "Type: " << room["RoomType"] << "\n";
        output << "Capacity: " << room["StudentCapacity"] << "\n";
        return output.str();
    }
    catch (const nlohmann::json::exception& e) {
        return "Error reading room status: " + std::string(e.what());
    }
}

