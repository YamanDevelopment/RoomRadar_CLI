cmake_minimum_required(VERSION 3.0.0)
project(roomradar)

# Force GCC
set(CMAKE_CXX_COMPILER g++)

# Set C++23 standard
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED TRUE)

# Add GCC-specific flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -O2")

add_executable(roomradar
    src/main.cc
    src/help.cc
    src/room.cc
)
