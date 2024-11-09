#ifndef TABLE_H
#define TABLE_H
#include <iostream>
#include <iomanip>
#include <vector>
#include <string>

class roomData {
    std::string room_number;
    std::string schedule;
    std::string status;
    int rating;
    friend std::ostream& operator<<(std::ostream &o, const roomData data);
};

void printRow(const std::vector<roomData>& rowData, int columnWidth);
void printSeparator(int numColumns, int columnWidth);
void displayTable(const std::vector<std::vector<roomData>>& tableData, int columnWidth);

#endif