#include "table.h"
#include <iostream>
#include <iomanip>

// Define the functions as before\

std::ostream& operator<<(std::ostream &o, const roomData data) {
    o << data.room_number << " |" << data.status << " |" << data.rating << (data.schedule == "" ? "" : data.schedule);
    return o; 
}
// ALL BELOW WAS WRITTEN BY MY BOY CHATGPT
void printRow(const std::vector<roomData>& rowData, int columnWidth) {
    std::cout << "|";
    for (const auto& item : rowData) {
        std::cout << " " << std::setw(columnWidth) << std::left << item << " |";
    }
    std::cout << "\n";
}

void printSeparator(int numColumns, int columnWidth) {
    std::cout << "+";
    for (int i = 0; i < numColumns; ++i) {
        std::cout << std::string(columnWidth + 2, '-') << "+";
    }
    std::cout << "\n";
}
void displayTable(const std::vector<std::vector<roomData>>& tableData, int columnWidth) {
    if (tableData.empty()) return;
    printSeparator(tableData[0].size(), columnWidth);

    std::cout << "|";
    for (const auto& header : tableData[0]) {
        std::cout << " \033[1;37;44m" << std::setw(columnWidth) << std::left << header << "\033[0m |";
    }
    std::cout << "\n";
    printSeparator(tableData[0].size(), columnWidth);

    for (size_t i = 1; i < tableData.size(); ++i) {
        printRow(tableData[i], columnWidth);
        printSeparator(tableData[i].size(), columnWidth);
    }
}
