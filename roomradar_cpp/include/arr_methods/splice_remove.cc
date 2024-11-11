#include "arr_methods.hh"

template<typename T>
void splice_remove(T arr[], int& size, int start, int delete_count) {
    if (start < 0 || start >= size || delete_count <= 0) return;
    
    int elements_to_move = size - (start + delete_count);
    if (elements_to_move > 0) {
        for (int i = start; i < size - delete_count; i++) {
            arr[i] = arr[i + delete_count];
        }
    }
    
    size -= std::min(delete_count, size - start);
}