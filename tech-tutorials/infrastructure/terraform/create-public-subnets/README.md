![diagram](https://github.com/grit-coding/DevToCodeSnippets/blob/main/tech-tutorials/infrastructure/terraform/create-public-subnets/images/diagram.png) 

TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id


