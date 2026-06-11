from django.db.backends.postgresql.base import DatabaseWrapper as PostgresDatabaseWrapper
import boto3
from botocore.exceptions import BotoCoreError, ClientError

class DatabaseWrapper(PostgresDatabaseWrapper):
    def get_connection_params(self):
        params = super().get_connection_params()
        host = params.get('host', '')
        
        # If connecting to AWS RDS, try to generate the database IAM auth token on-the-fly
        if host and 'amazonaws.com' in host:
            try:
                rds_client = boto3.client('rds', region_name='ap-south-1')
                token = rds_client.generate_db_auth_token(
                    DBHostname=host,
                    Port=int(params.get('port', 5432)),
                    DBUsername=params.get('user', 'postgres'),
                    Region='ap-south-1'
                )
                params['password'] = token
            except (BotoCoreError, ClientError) as e:
                # Fallback to configured settings/env password if AWS credentials are not found
                import sys
                sys.stderr.write(f"AWS RDS IAM Auth Warning: {e}. Falling back to password auth.\n")
            
        return params
