cmake_minimum_required(VERSION 3.31.0)
project(roomradar)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED TRUE)

add_executable(roomradar
    src/main.cc
    src/help.cc
)