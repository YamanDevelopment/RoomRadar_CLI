#ifndef TABLE_H
#define TABLE_H
#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
#include "../types/room.hh"


void printRow(const std::vector<roomData>& rowData, int columnWidth);
void printSeparator(int numColumns, int columnWidth);
void displayTable(const std::vector<std::vector<roomData>>& tableData, int columnWidth);

#endif