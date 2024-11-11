#include "../include/table/table.hh"
#include "../include/types/room.hh"
#include "../include/arr_methods/arr_methods.hh"
#include "main.hh"

int main(int argc, char* argv[]) {
    if(argc < 2) show_help();
    else if (std::string(argv[1]) == "help") show_more_help();
    else {
        bool schedule = false;
        bool day = false; 
        for(int i = 1; i < argc; i++) {
            std::string current_arg = argv[i];
            if(current_arg.find("-") == 0 || !current_arg.find("--")) {
                if(current_arg == "-s" || current_arg == "--schedule") schedule = true;
                splice_remove(argv, argc,i,2);
            }
               
        }
    }
    
    return 0;
}

