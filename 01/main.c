#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int part1(void) {
  FILE *file = fopen("input.txt", "r");
  int result = 0;

  int i = 0;
  int i_prev = -1;

  fscanf(file, "%d", &i);
  while (!feof(file)) {
    if (i > i_prev)
      result++;

    i_prev = i;
    fscanf(file, "%d", &i);
  }
  fclose(file);

  return result;
}

int part2(void) {
  FILE *file = fopen("input.txt", "r");
  int part2_result = 0;

  int i = 0;
  int index = 0;
  int i_prev[3] = {0};

  fscanf(file, "%d", &i);
  while (!feof(file)) {

    if (index > 1 && i > i_prev[0])
      part2_result++;

    /** Move every previous item back. */
    for (int j = 0; j < 3; j++) {
      i_prev[j] = i_prev[j + 1];
    }
    i_prev[2] = i;

    fscanf(file, "%d", &i);
    index++;
  }
  fclose(file);

  return part2_result;
}

int main(void) {

  clock_t start = clock();
  int result = part1();
  clock_t end = clock();

  printf("Part 1: %d -> Time: %ld "
         "microsecs\n",
         result, end - start);

  start = clock();
  result = part2();
  end = clock();

  printf("Part 2: %d -> Time: %ld "
         "microsecs\n",
         result, end - start);
  return 0;
}