import java.util.*;
import java.io.*;

class Main {
	// Top-Down way
	static int memo[] = new int[100];
	public static void main (String args[]) throws IOException {
		
//		System.out.println("Input a fibo number ...");
		Scanner sc = new Scanner(System.in);
		
		int ans = fibo(sc.nextInt());
		System.out.println(ans);
		
		sc.close();
	}
	
	public static int fibo (int n) {
		
		
		if (n <= 1) {
			return n;
			
		} else {
			if (memo[n] > 0) {
				return memo[n];
			}
			memo[n] = fibo(n-2) + fibo(n-1);
			return memo[n];
			// use "for-loop" in case of bottom-up way
		
		}
	}
}
