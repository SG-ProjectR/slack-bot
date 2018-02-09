using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnenoteLinker
{
	class Program
	{
		static string ProcessInput(string s)
		{
			// TODO Verify and validate the input 
			// string as appropriate for your application.
			return s;
		}
		static void Main(string[] args)
		{
			//Console.WriteLine("Alert.exe invoked with the following parameters.\r\n");
			//Console.WriteLine("Raw command-line: \n\t" + Environment.CommandLine);
			//Console.WriteLine("\n\nArguments:\n");
			//foreach (string s in args)
			//{
			//	Console.WriteLine("\t" + ProcessInput(s));
			//}

			if (args.Length > 0)
			{
				var onenoteLinkPath = args[0];
				//onenoteLinkPath = Uri.UnescapeDataString(args[0].Replace("onenotelinker:///", ""));
				onenoteLinkPath = Uri.UnescapeDataString(args[0].Replace("onenotelinker:///", "onenote:///")).Replace(" ", "%20");
				//Console.WriteLine($"\n{onenoteLinkPath}");
				System.Diagnostics.Process.Start(@"C:\Program Files\MICROS~1\Office15\ONENOTE.EXE", $"/hyperlink {onenoteLinkPath}");
			}
			//Console.WriteLine(Uri.EscapeDataString("/"));
			//onenote:///P:\OneNote\DP\08_팀\신입사원%20가이드.one#해%20두면%20좋은%20것들&section-id={A8BE42D5-E2D5-484B-AB1D-2FE1E9EEB916}&page-id={08687D13-14CB-4527-9BC8-347285E5A86B}&end
			//P:\OneNote\DP\08_팀\신입사원%20가이드.one#Swarm%20설치&section-id={A8BE42D5-E2D5-484B-AB1D-2FE1E9EEB916}&page-id={2614412C-F64E-40D5-94A2-47F85400FE30}&end

			//Console.WriteLine("\nPress any key to continue...");

			//Console.ReadKey();
		}
	}
}
