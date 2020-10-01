# sam logs<a name="sam-cli-command-reference-sam-logs"></a>

Fetches logs that are generated by your Lambda function\.

When your functions are a part of an AWS CloudFormation stack, you can fetch logs by using the function's logical ID when you specify the stack name\.

**Usage:**

```
sam logs [OPTIONS]
```

**Examples:**

```
sam logs -n HelloWorldFunction --stack-name mystack

# Or, you can fetch logs using the function's name.
sam logs -n mystack-HelloWorldFunction-1FJ8PD36GML2Q

# You can view logs for a specific time range using the -s (--start-time) and -e (--end-time) options
sam logs -n HelloWorldFunction --stack-name mystack -s '10min ago' -e '2min ago'

# You can also add the --tail option to wait for new logs and see them as they arrive.
sam logs -n HelloWorldFunction --stack-name mystack --tail

# Use the --filter option to quickly find logs that match terms, phrases or values in your log events.
sam logs -n HelloWorldFunction --stack-name mystack --filter "error"
```

**Options:**


****  

| Option | Description | 
| --- | --- | 
| \-n, \-\-name TEXT | The name of your Lambda function\. If this function is part of an AWS CloudFormation stack, this can be the logical ID of the function resource in the AWS CloudFormation/AWS SAM template\. \[required\] | 
| \-\-stack\-name TEXT | The name of the AWS CloudFormation stack that the function is a part of\. | 
| \-\-filter TEXT | Lets you specify an expression to quickly find logs that match terms, phrases, or values in your log events\. This can be a simple keyword \(for example, "error"\) or a pattern that's supported by Amazon CloudWatch Logs\. For the syntax, see the [Amazon CloudWatch Logs documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html)\. | 
| \-s, \-\-start\-time TEXT | Fetches logs starting at this time\. The time can be relative values like '5mins ago', 'yesterday', or a formatted timestamp like '2018\-01\-01 10:10:10'\. It defaults to '10mins ago'\. | 
| \-e, \-\-end\-time TEXT | Fetches logs up to this time\. The time can be relative values like '5mins ago', 'tomorrow', or a formatted timestamp like '2018\-01\-01 10:10:10'\. | 
| \-t, \-\-tail | Tails the log output\. This ignores the end time argument and continues to fetch logs as they become available\. | 
| \-\-profile TEXT | The specific profile from your credential file that gets AWS credentials\. | 
|  \-\-region TEXT | The AWS Region to deploy to\. For example, us\-east\-1\. | 
| \-\-config\-file PATH | The path and file name of the configuration file containing default parameter values to use\. The default value is "samconfig\.toml" in the root of the project directory\. For more information about configuration files, see [AWS SAM CLI configuration file](serverless-sam-cli-config.md)\. | 
| \-\-config\-env TEXT | The environment name specifying the default parameter values in the configuration file to use\. The default value is "default"\. For more information about configuration files, see [AWS SAM CLI configuration file](serverless-sam-cli-config.md)\. | 
| \-\-debug | Turns on debug logging to print debug messages that are generated by the AWS SAM CLI\. | 
| \-\-help | Shows this message and exits\. | 