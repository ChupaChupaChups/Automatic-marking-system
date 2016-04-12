#include <stdio.h>
 
int main() {
    int t;
    scanf("%d", &t);
     
    while (t--) {
        int ax, ay, bx, by;
        int planet;
        int C = 0;
        scanf("%d %d %d %d", &ax, &ay, &bx, &by);
        scanf("%d", &planet);
 
        while (planet--) {
            int s = 0, e = 0;
            int  cx, cy, r;
            scanf("%d %d %d", &cx, &cy, &r);
 
            if ((ax - cx) * (ax - cx) + (ay - cy) * (ay - cy) < r * r)
                s = 1;
            if ((bx - cx) * (bx - cx) + (by - cy) * (by - cy) < r * r)
                e = 1;
 
            if (s && !e)
                C++;
            else if (!s && e)
                C++;
        }
 
        printf("%d\n", C);
    }
}
