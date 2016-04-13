#include <stdio.h>
 
int main() {
    int testCase;
    scanf("%d", &testCase);
     
    while (testCase--) {
        int x1, y1,
            x2, y2;
        int planet;
        int enterCount = 0;
        scanf("%d %d %d %d", &x1, &y1, &x2, &y2);
        scanf("%d", &planet);
 
        while (planet--) {
            bool start      = false;
            bool end        = false;
            int  cx, cy, r;
            scanf("%d %d %d", &cx, &cy, &r);
 
            if ((x1 - cx) * (x1 - cx) + (y1 - cy) * (y1 - cy) < r * r)
                start = true;
            if ((x2 - cx) * (x2 - cx) + (y2 - cy) * (y2 - cy) < r * r)
                end = true;
 
            if (start && !end)
                enterCount++;
            else if (!start && end)
                enterCount++;
        }
 
        printf("%d\n", enterCount);
    }
}
