#include<cstdio>

int dp[1001] = {0, 1, 1, };

int fibonacci(int i){
	if(i == 0) return 0;
	if(i == 1 || i == 2) return 1;
	if(dp[i] != 0) return dp[i];
	return dp[i] = fibonacci(i-2)+fibonacci(i-1);
}
int main(){
	int num;
	scanf("%d", &num);
	printf("%d\n", fibonacci(num));
}
