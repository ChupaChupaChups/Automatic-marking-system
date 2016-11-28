#include<stdio.h>

int fibonacci(int i){
	if(i == 0) return 0;
	if(i == 1 || i == 2) return 1;
	return fibonacci(i-2)+fibonacci(i-1);
}
int main(){
	int num;
	scanf("%d", &num);
	printf("%d\n", fibonacci(num));
}
